
//= require <mtools/record>
//= require <webdoc/model/item>

WebDoc.PageView = $.klass(
{
    initialize: function(page)
    {
        this.domNode = $('<div>').attr(
        {
            id: "board",
            style: "position: absolute; top: 0px; left: 0px;z-index:0"
        });
		this.domNode.css(page.data.data.css);
        this.domNode.append($('<div>').attr(
        {
            id: "page_drawing",
            style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
        }));
        this.domNode.append($('<div>').attr(
        {
            id: "items",
            style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%"
        }));
        this.domNode.append($('<div>').attr(
        {
            id: "event-catcher",
            style: "position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; z-index: 999999"
        }));
        var that = this;
        if (page.items && $.isArray(page.items)) 
        {
            $.each(page.items, function()
            {
                var itemView = new WebDoc.ItemView(this);
                if (this.data.media_type == "drawing") 
                {
                    console.log("drawing node");
					console.log(WebDoc.application.boardController.drawingController.domNode);
					console.log("item node");
                    console.log(itemView.domNode);
                    WebDoc.application.boardController.drawingController.domNode.appendChild(itemView.domNode.get(0));
                }
                else 
                {
                    this.domNode.get(0).appendChild(itemView.domNode.get(0));
                }
                itemView.domNode.animate(
                {
                    opacity: 1
                }, 'fast');
            });
        }
        page.addListener(this);
    },
    
    objectChanged: function(page)
    {
        this.domNode.animate(page.data.data.css, 'fast');
    }
    
});
